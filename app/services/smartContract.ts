import { Contract, parseEther, formatEther } from 'ethers';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { LocalBasePaymentABI } from '../contracts/LocalBasePayment.abi';
import { CONTRACT_CONFIG } from '../config/contract';

export interface OnChainBusiness {
  owner: string;
  name: string;
  isActive: boolean;
  totalReceived: string;
  transactionCount: number;
}

export class SmartContractService {
  private static contract: Contract | null = null;
  private static provider: BrowserProvider | null = null;
  private static signer: JsonRpcSigner | null = null;

  // Initialize the smart contract connection
  static async initialize(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        console.warn('No ethereum provider found');
        return false;
      }

      this.provider = new BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      this.contract = new Contract(
        CONTRACT_CONFIG.CONTRACT_ADDRESS,
        LocalBasePaymentABI,
        this.signer
      );

      console.log('✅ Smart contract initialized:', CONTRACT_CONFIG.CONTRACT_ADDRESS);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize smart contract:', error);
      return false;
    }
  }

  // Check if we're using real contracts or mock mode
  static isEnabled(): boolean {
    return CONTRACT_CONFIG.USE_REAL_CONTRACT;
  }

  // Register a business on-chain
  static async registerBusiness(businessId: string, businessName: string): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('Smart contract mode is disabled');
    }

    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Smart contract not initialized');
    }

    try {
      // First check if business already exists
      const exists = await this.contract.businessExists(businessId);
      if (exists) {
        throw new Error(`Business with ID "${businessId}" already exists on-chain`);
      }

      console.log(`📝 Registering business on-chain: ${businessName} (ID: ${businessId})`);
      
      const tx = await this.contract.registerBusiness(businessId, businessName);
      console.log('🔄 Transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Business registered on-chain:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('❌ Failed to register business:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          throw new Error('This business ID is already registered on the blockchain. Please choose a different ID.');
        } else if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient ETH balance. Please get some Base Sepolia ETH from a faucet.');
        } else if (error.message.includes('user rejected')) {
          throw new Error('Transaction was cancelled by user.');
        }
      }
      
      throw error;
    }
  }

  // Make a payment to a business
  static async payBusiness(businessId: string, amount: string): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('Smart contract mode is disabled');
    }

    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Smart contract not initialized');
    }

    try {
      // First check if business exists
      const exists = await this.contract.businessExists(businessId);
      if (!exists) {
        throw new Error(`Business with ID "${businessId}" not found on-chain`);
      }

      const ethAmount = parseEther(amount);
      console.log(`💳 Making payment on-chain: ${amount} ETH to business ${businessId}`);
      
      const tx = await this.contract.payBusiness(businessId, { value: ethAmount });
      console.log('🔄 Payment transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Payment confirmed on-chain:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('❌ Payment failed:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          throw new Error('Insufficient ETH balance. Please get some Base Sepolia ETH from a faucet.');
        } else if (error.message.includes('user rejected')) {
          throw new Error('Transaction was cancelled by user.');
        } else if (error.message.includes('not found')) {
          throw new Error('Business not found on blockchain. It may need to be registered first.');
        } else if (error.message.includes('not active')) {
          throw new Error('This business is currently inactive and cannot receive payments.');
        }
      }
      
      throw error;
    }
  }

  // Get business information from the blockchain
  static async getBusinessInfo(businessId: string): Promise<OnChainBusiness | null> {
    if (!this.isEnabled()) {
      return null;
    }

    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      return null;
    }

    try {
      // Check if business exists first
      const exists = await this.contract.businessExists(businessId);
      if (!exists) {
        return null;
      }

      const businessInfo = await this.contract.getBusinessInfo(businessId);
      
      return {
        owner: businessInfo.owner,
        name: businessInfo.name,
        isActive: businessInfo.isActive,
        totalReceived: formatEther(businessInfo.totalReceived),
        transactionCount: Number(businessInfo.transactionCount)
      };
    } catch (error) {
      console.error('❌ Failed to get business info:', error);
      return null;
    }
  }

  // Check if a business exists on-chain
  static async businessExists(businessId: string): Promise<boolean> {
    if (!this.isEnabled()) {
      return false;
    }

    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      return false;
    }

    try {
      return await this.contract.businessExists(businessId);
    } catch (error) {
      console.error('❌ Failed to check business existence:', error);
      return false;
    }
  }

  // Get user's total spending
  static async getUserTotalSpent(userAddress: string): Promise<string> {
    if (!this.isEnabled()) {
      return '0';
    }

    if (!this.contract) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.warn('⚠️ Contract not initialized, returning 0 for user spending');
        return '0';
      }
    }

    if (!this.contract) {
      return '0';
    }

    try {
      // Add validation for address format
      if (!userAddress || !userAddress.startsWith('0x')) {
        console.warn('⚠️ Invalid user address format:', userAddress);
        return '0';
      }

      console.log('🔍 Getting user total spent for:', userAddress);
      const spent = await this.contract.getUserTotalSpent(userAddress);
      
      // Handle case where spent might be undefined or null
      if (!spent) {
        console.log('📊 No spending data found for user, returning 0');
        return '0';
      }
      
      const formattedSpent = formatEther(spent);
      console.log('📊 User total spent:', formattedSpent, 'ETH');
      return formattedSpent;
    } catch (error) {
      console.error('❌ Failed to get user spending:', error);
      // Check if it's a contract call error (user hasn't spent anything yet)
      if (error instanceof Error && error.message.includes('BAD_DATA')) {
        console.log('🔍 User likely has no spending history, returning 0');
        return '0';
      }
      return '0';
    }
  }

  // Withdraw payments (for business owners)
  static async withdrawPayments(businessId: string): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('Smart contract mode is disabled');
    }

    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Smart contract not initialized');
    }

    try {
      console.log(`💰 Withdrawing payments for business: ${businessId}`);
      
      const tx = await this.contract.withdrawPayments(businessId);
      console.log('🔄 Withdrawal transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Withdrawal confirmed:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('❌ Withdrawal failed:', error);
      throw error;
    }
  }

  // Toggle business status
  static async toggleBusinessStatus(businessId: string): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('Smart contract mode is disabled');
    }

    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Smart contract not initialized');
    }

    try {
      console.log(`🔄 Toggling business status: ${businessId}`);
      
      const tx = await this.contract.toggleBusinessStatus(businessId);
      console.log('🔄 Status toggle transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Status toggle confirmed:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('❌ Status toggle failed:', error);
      throw error;
    }
  }

  // Get contract address
  static getContractAddress(): string {
    return CONTRACT_CONFIG.CONTRACT_ADDRESS;
  }

  // Get network info
  static getNetworkInfo() {
    return CONTRACT_CONFIG.NETWORK;
  }
}
