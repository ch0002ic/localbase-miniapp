# LocalBase - Setup Guide for Real Transactions

## 🎯 Current Status
- ✅ **Mock Mode Active** - All transactions are simulated for demo purposes
- ✅ **UI Working** - Full interface with wallet connection
- ✅ **Smart Contract Ready** - LocalBasePayment.sol tested and ready to deploy

## 🚀 To Enable Real Transactions

### Step 1: Get Base Sepolia ETH
1. Visit [Base Bridge](https://bridge.base.org/deposit) or [Base Faucet](https://bridge.base.org/deposit)
2. Get at least 0.01 ETH for deployment and testing

### Step 2: Deploy Contract with Funds
```bash
cd contracts
# Make sure you have ETH in your wallet first
forge script script/LocalBasePayment.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $BASESCAN_API_KEY
```

### Step 3: Update Contract Address
1. Copy the deployed contract address from terminal output
2. Update `LOCAL_BASE_PAYMENT_ADDRESS` in `/app/services/contract.ts`
3. Set `MOCK_MODE = false` in the same file

### Step 4: Test Real Transactions
- Connect wallet to Base Sepolia
- Click "Pay with Base" - real transaction will execute
- Click "Register Business" - business will be stored on-chain

## 🎪 For Hackathon Demo
The current mock mode is perfect for demonstrations:
- ✅ Shows complete user flow
- ✅ No dependency on testnet funds
- ✅ Instant "transactions" for smooth demos
- ✅ All UI/UX functionality working

## 🔧 Development Commands
```bash
# Start development server
npm run dev

# Run contract tests
cd contracts && forge test

# Deploy when ready
cd contracts && forge script script/LocalBasePayment.s.sol --broadcast
```

## 📋 Features Ready
- [x] Wallet connection (OnchainKit)
- [x] Network switching to Base Sepolia
- [x] Business discovery with filtering
- [x] Payment transactions (mock/real)
- [x] Business registration (mock/real)
- [x] Error handling and user feedback
- [x] Responsive design
- [x] Demo mode for presentations

**LocalBase is hackathon-ready! 🚀**
