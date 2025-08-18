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
      console.log(`📝 Registering business on-chain: ${businessName} (ID: ${businessId})`);
      
      const tx = await this.contract.registerBusiness(businessId, businessName);
      console.log('🔄 Transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Business registered on-chain:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('❌ Failed to register business:', error);
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
      const ethAmount = parseEther(amount);
      console.log(`💳 Making payment on-chain: ${amount} ETH to business ${businessId}`);
      
      const tx = await this.contract.payBusiness(businessId, { value: ethAmount });
      console.log('🔄 Payment transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Payment confirmed on-chain:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('❌ Payment failed:', error);
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
      await this.initialize();
    }

    if (!this.contract) {
      return '0';
    }

    try {
      const spent = await this.contract.getUserTotalSpent(userAddress);
      return formatEther(spent);
    } catch (error) {
      console.error('❌ Failed to get user spending:', error);
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
