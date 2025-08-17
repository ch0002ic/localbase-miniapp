import { createPublicClient, createWalletClient, custom, formatEther, parseEther, http, WalletClient } from 'viem';
import { baseSepolia } from 'viem/chains';
import { CONTRACT_CONFIG } from '../config/contract';

// Contract ABI for LocalBasePayment
export const LOCAL_BASE_PAYMENT_ABI = [
  {
    "type": "function",
    "name": "registerBusiness",
    "inputs": [
      {"name": "businessId", "type": "string"},
      {"name": "name", "type": "string"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "payBusiness",
    "inputs": [{"name": "businessId", "type": "string"}],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getBusinessInfo",
    "inputs": [{"name": "businessId", "type": "string"}],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          {"name": "owner", "type": "address"},
          {"name": "name", "type": "string"},
          {"name": "isActive", "type": "bool"},
          {"name": "totalReceived", "type": "uint256"},
          {"name": "transactionCount", "type": "uint256"}
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "withdrawPayments",
    "inputs": [{"name": "businessId", "type": "string"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getUserTotalSpent",
    "inputs": [{"name": "user", "type": "address"}],
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "PaymentMade",
    "inputs": [
      {"name": "businessId", "type": "string", "indexed": true},
      {"name": "customer", "type": "address", "indexed": true},
      {"name": "amount", "type": "uint256", "indexed": false}
    ]
  }
] as const;

// Contract address from configuration
export const LOCAL_BASE_PAYMENT_ADDRESS = CONTRACT_CONFIG.CONTRACT_ADDRESS as const;

// Mock mode configuration
const MOCK_MODE = !CONTRACT_CONFIG.USE_REAL_CONTRACT;

export class LocalBaseContract {
  private publicClient;
  private walletClient: WalletClient | undefined;

  constructor() {
    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });
  }

  // Initialize wallet client when needed
  private async getWalletClient() {
    if (!this.walletClient && typeof window !== 'undefined' && window.ethereum) {
      this.walletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(window.ethereum)
      });
      
      // Request account access
      try {
        await this.walletClient.requestAddresses();
      } catch (error) {
        console.error('Failed to request wallet access:', error);
        throw new Error('Please connect your wallet and grant permission to this app');
      }
    }
    return this.walletClient;
  }

  // Register a business on-chain
  async registerBusiness(businessId: string, name: string, userAddress: `0x${string}`) {
    if (MOCK_MODE) {
      // Mock successful transaction for testing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time
      return {
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'success',
        mock: true
      };
    }

    const walletClient = await this.getWalletClient();
    if (!walletClient) throw new Error('Wallet not connected');

    // Check if we're on the correct network
    const chainId = await walletClient.getChainId();
    if (chainId !== baseSepolia.id) {
      // Try to switch to Base Sepolia
      try {
        await walletClient.switchChain({ id: baseSepolia.id });
      } catch (switchError) {
        // If switching fails, try to add the network
        try {
          await walletClient.addChain({ chain: baseSepolia });
        } catch (addError) {
          throw new Error(`Please switch to Base Sepolia network manually. Current network: ${chainId}, Required: ${baseSepolia.id}`);
        }
      }
    }

    const { request } = await this.publicClient.simulateContract({
      address: LOCAL_BASE_PAYMENT_ADDRESS,
      abi: LOCAL_BASE_PAYMENT_ABI,
      functionName: 'registerBusiness',
      args: [businessId, name],
      account: userAddress,
    });

    const hash = await walletClient.writeContract(request);
    
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    return receipt;
  }

  // Make payment to a business
  async payBusiness(businessId: string, amount: string, userAddress: `0x${string}`) {
    if (MOCK_MODE) {
      // Mock successful transaction for testing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time
      return {
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'success',
        mock: true
      };
    }

    const walletClient = await this.getWalletClient();
    if (!walletClient) throw new Error('Wallet not connected');

    // Check if we're on the correct network
    const chainId = await walletClient.getChainId();
    if (chainId !== baseSepolia.id) {
      // Try to switch to Base Sepolia
      try {
        await walletClient.switchChain({ id: baseSepolia.id });
      } catch (switchError) {
        // If switching fails, try to add the network
        try {
          await walletClient.addChain({ chain: baseSepolia });
        } catch (addError) {
          throw new Error(`Please switch to Base Sepolia network manually. Current network: ${chainId}, Required: ${baseSepolia.id}`);
        }
      }
    }

    const { request } = await this.publicClient.simulateContract({
      address: LOCAL_BASE_PAYMENT_ADDRESS,
      abi: LOCAL_BASE_PAYMENT_ABI,
      functionName: 'payBusiness',
      args: [businessId],
      account: userAddress,
      value: parseEther(amount),
    });

    const hash = await walletClient.writeContract(request);
    
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    return receipt;
  }

  // Get business information
  async getBusinessInfo(businessId: string) {
    try {
      const result = await this.publicClient.readContract({
        address: LOCAL_BASE_PAYMENT_ADDRESS,
        abi: LOCAL_BASE_PAYMENT_ABI,
        functionName: 'getBusinessInfo',
        args: [businessId],
      });

      return {
        owner: result.owner,
        name: result.name,
        isActive: result.isActive,
        totalReceived: formatEther(result.totalReceived),
        transactionCount: Number(result.transactionCount)
      };
    } catch (error) {
      console.error('Error fetching business info:', error);
      return null;
    }
  }

  // Get user's total spending
  async getUserTotalSpent(userAddress: `0x${string}`) {
    try {
      const result = await this.publicClient.readContract({
        address: LOCAL_BASE_PAYMENT_ADDRESS,
        abi: LOCAL_BASE_PAYMENT_ABI,
        functionName: 'getUserTotalSpent',
        args: [userAddress],
      });

      return formatEther(result);
    } catch (error) {
      console.error('Error fetching user spending:', error);
      return '0';
    }
  }

  // Withdraw payments (for business owners)
  async withdrawPayments(businessId: string, userAddress: `0x${string}`) {
    const walletClient = await this.getWalletClient();
    if (!walletClient) throw new Error('Wallet not connected');

    const { request } = await this.publicClient.simulateContract({
      address: LOCAL_BASE_PAYMENT_ADDRESS,
      abi: LOCAL_BASE_PAYMENT_ABI,
      functionName: 'withdrawPayments',
      args: [businessId],
      account: userAddress,
    });

    const hash = await walletClient.writeContract(request);
    
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    return receipt;
  }
}

// Singleton instance
export const localBaseContract = new LocalBaseContract();
