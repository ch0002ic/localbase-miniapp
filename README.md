# LocalBase MiniApp 🏪

A decentralized local business directory and community platform built with MiniKit, OnchainKit, and Next.js on Base blockchain. LocalBase enables users to discover local businesses, make payments with cryptocurrency, and engage in community discussions.

## 🚀 **LIVE ON BASE SEPOLIA** 

**Smart Contract**: [`0xd7dA1c82D2c2Ad373a7a6b1e9DE7883E760Dea7C`](https://sepolia.basescan.org/address/0xd7dA1c82D2c2Ad373a7a6b1e9DE7883E760Dea7C)  
**Network**: Base Sepolia Testnet  
**Status**: ✅ Deployed & Verified

## 🌟 Features

### **Core Platform**
- **🏪 Business Directory**: Browse and discover local businesses with categories
- **💳 Crypto Payments**: Make real ETH payments to businesses on Base Sepolia  
- **🏢 Business Registration**: Register your business with blockchain verification
- **🎖️ Verification System**: Business badges and reputation scoring
- **📱 Mobile Responsive**: Works seamlessly on all devices

### **Web3 Integration**
- **⚡ Real Blockchain Transactions**: All payments are real Base Sepolia transactions
- **🔐 Wallet Integration**: Coinbase Wallet with OnchainKit
- **📊 On-chain Analytics**: Business revenue and transaction tracking
- **🔍 Transaction Verification**: All transactions visible on BaseScan
- **⛽ Gas Optimized**: Efficient smart contracts (120k gas registration, 72k payments)

### **Community Features**
- **👥 Community Feed**: Social platform with posts, comments, and likes  
- **📈 Trending & Local Events**: Stay updated with community happenings
- **🏆 Rewards System**: Earn rewards for engagement and transactions
- **👍 Fair Engagement**: One-like-per-user system preventing spam

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Base Sepolia Testnet, Solidity ^0.8.19
- **Web3**: MiniKit, OnchainKit, Wagmi, Viem
- **Smart Contracts**: Foundry development framework
- **Storage**: localStorage (client-side persistence)
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A web browser with wallet support (MetaMask, etc.)
- Base Sepolia testnet ETH for transactions
- Git for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ch0002ic/localbase-miniapp.git
cd localbase-miniapp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add the following environment variables to `.env.local`:

```env
# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_CDP_PROJECT_ID=your_cdp_project_id

# Base Sepolia Configuration (Pre-configured)
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# LocalBase Smart Contract (Pre-deployed)
NEXT_PUBLIC_CONTRACT_ADDRESS=0xd7dA1c82D2c2Ad373a7a6b1e9DE7883E760Dea7C

# App Configuration
NEXT_PUBLIC_APP_NAME=LocalBase
NEXT_PUBLIC_APP_DESCRIPTION="Decentralized Local Business Directory"
```

### 4. Get Base Sepolia ETH

To interact with LocalBase, you need Base Sepolia testnet ETH:

#### Recommended Faucets:
- **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia (0.1 ETH daily)
- **QuickNode Faucet**: https://faucet.quicknode.com/base/sepolia (0.05 ETH daily)  
- **Triangle Faucet**: https://faucet.triangle.trade/ (Variable amounts)

#### Your Wallet Address:
Copy your wallet address from Coinbase Wallet and use it with the faucets above.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Using the App

### **Getting Started**
1. **Connect Wallet**: Click "Connect Wallet" and select Coinbase Wallet
2. **Switch Network**: App will automatically prompt to switch to Base Sepolia
3. **Get Test ETH**: Use the in-app faucet helper for Base Sepolia ETH
4. **Start Exploring**: Browse businesses and make payments!

### **Business Directory**
1. **Browse Businesses**: View businesses by category on the main page
2. **Make Payments**: Click "Pay 0.001 ETH" to make real blockchain payments
3. **View Details**: See business verification badges and transaction counts
4. **Transaction History**: All payments are visible on [BaseScan](https://sepolia.basescan.org)

### **Register a Business**
1. **Click "Register Business"**: Use the blue button on the main page
2. **Fill Details**: Enter business name, description, category, and address
3. **Blockchain Registration**: Business is stored on Base Sepolia blockchain
4. **Start Accepting Payments**: Your business can immediately receive payments

### **Real Blockchain Features**
- **💳 Payments**: 0.001 ETH payments (much cheaper than 0.01 ETH!)
- **📊 Analytics**: Real revenue tracking for business owners
- **🔍 Verification**: All transactions verifiable on BaseScan
- **⛽ Gas Efficient**: Optimized smart contracts for low fees

### Making Payments
1. Ensure your wallet is connected
2. Have Base Sepolia ETH in your wallet
## 🏗️ Architecture & Smart Contracts

### **Smart Contract Details**
- **Contract Address**: `0xd7dA1c82D2c2Ad373a7a6b1e9DE7883E760Dea7C`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Language**: Solidity ^0.8.19
- **Framework**: Foundry
- **Verification**: ✅ Verified on BaseScan

### **Key Functions**
```solidity
function registerBusiness(string businessId, string name) external
function payBusiness(string businessId) external payable
function withdrawPayments(string businessId) external
function getBusinessInfo(string businessId) external view
```

### **Project Structure**
```
localbase-miniapp/
├── app/
│   ├── components/
│   │   ├── business/          # Business directory & payments
│   │   ├── social/            # Community features
│   │   └── VerificationBadge.tsx  # Business verification system
│   ├── config/
│   │   └── contract.ts        # Smart contract configuration
│   ├── services/              # Blockchain & API services
│   ├── types/                 # TypeScript definitions
│   └── page.tsx               # Main app with wallet integration
├── contracts/
│   ├── src/LocalBasePayment.sol  # Main smart contract
│   ├── test/                     # Contract tests
│   └── script/                   # Deployment scripts
└── package.json               # Dependencies & scripts
```

## 🧪 Smart Contract Testing

The project includes comprehensive Foundry tests:

```bash
# Navigate to contracts directory
cd contracts

# Run all tests with gas reporting
npm run test:contracts
# or
forge test --gas-report

# Test specific functionality
forge test --match-test testPayBusiness -vvv
```

### **Test Coverage**
- ✅ Business registration
- ✅ Payment processing  
- ✅ Withdrawal functionality
- ✅ Access controls
- ✅ Error handling

## 📱 Mobile Support

LocalBase is fully optimized for mobile devices and works seamlessly with mobile wallets through MiniKit integration.

## 🏆 NTU x Base Web3 Hackathon

**LocalBase was built for the NTU x Base Web3 Hackathon, demonstrating:**

- ✅ **Real Web3 Integration**: Actual blockchain transactions on Base Sepolia
- ✅ **Production Quality**: Professional code with comprehensive testing
- ✅ **Practical Use Case**: Solving real-world local business adoption challenges
- ✅ **Base Ecosystem**: Native integration with Base blockchain and Coinbase tools
- ✅ **Scalable Architecture**: Ready for mainnet deployment

### **Live Demo Features**
- **Smart Contract**: Deployed and verified on Base Sepolia
- **Real Payments**: 0.001 ETH transactions (gas optimized)
- **Business Verification**: Badge system for trusted businesses
- **Mobile Ready**: Full responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support & Troubleshooting

### **Common Issues**
1. **"Insufficient funds"**: Get Base Sepolia ETH from faucets listed above
2. **"Wrong network"**: Switch to Base Sepolia in your wallet
3. **"Transaction failed"**: Check gas fees and wallet balance
4. **"Contract not found"**: Verify you're on Base Sepolia network

### **Getting Help**
- Check browser console for detailed error messages
- Verify your wallet is connected to Base Sepolia (Chain ID: 84532)
- Ensure you have at least 0.01 ETH for transactions
- Review the [Troubleshooting Guide](./SETUP.md)

## 🔗 Links & Resources

- **BaseScan Contract**: https://sepolia.basescan.org/address/0xd7dA1c82D2c2Ad373a7a6b1e9DE7883E760Dea7C
- **Base Documentation**: https://docs.base.org
- **OnchainKit Docs**: https://onchainkit.xyz/getting-started
- **MiniKit Documentation**: https://docs.base.org/mini-apps/technical-reference/minikit/overview
- **Foundry Toolkit**: https://book.getfoundry.sh/

---

**Built with ❤️ for the Base ecosystem | LocalBase - Connecting local businesses with Web3** 🚀
