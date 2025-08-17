# LocalBase MiniApp 🏪

A decentralized local business directory and community platform built with MiniKit, OnchainKit, and Next.js on Base blockchain. LocalBase enables users to discover local businesses, make payments with cryptocurrency, and engage in community discussions.

## 🌟 Features

- **Business Directory**: Browse and discover local businesses with categories
- **Crypto Payments**: Make payments to businesses using ETH on Base Sepolia
- **Business Registration**: Register your business with categories and descriptions
- **Community Feed**: Social platform with posts, comments, and likes
- **Trending & Local Events**: Stay updated with community happenings
- **Rewards System**: Earn rewards for engagement and transactions
- **One-Like-Per-User**: Fair engagement system preventing spam
- **Auto Transaction Counting**: Automatic business transaction tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Base Sepolia Testnet
- **Web3**: MiniKit, OnchainKit, Wagmi
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

# Base Sepolia Configuration
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# App Configuration
NEXT_PUBLIC_APP_NAME=LocalBase
NEXT_PUBLIC_APP_DESCRIPTION="Decentralized Local Business Directory"
```

### 4. Get API Keys

#### OnchainKit API Key:
1. Visit [OnchainKit Dashboard](https://onchainkit.xyz)
2. Create an account or sign in
3. Generate an API key
4. Add it to your `.env.local` file

#### CDP Project ID:
1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com)
2. Create a new project
3. Copy the Project ID
4. Add it to your `.env.local` file

### 5. Get Base Sepolia ETH

1. Visit [Base Sepolia Faucet](https://faucet.quicknode.com/base/sepolia)
2. Connect your wallet
3. Request test ETH for transactions

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Using the App

### Business Directory
1. Browse businesses by category on the main page
2. Click "Pay Business" to make cryptocurrency payments
3. View business details and transaction counts

### Register a Business
1. Click "Register Business" button
2. Fill in business details (name, description, category, price)
3. Submit to add your business to the directory

### Community Feed
1. Navigate to the "Community" tab
2. Create posts, like, and comment
3. Switch between "Trending" and "Local Events"
4. Each wallet can like a post only once

### Making Payments
1. Ensure your wallet is connected
2. Have Base Sepolia ETH in your wallet
3. Click "Pay Business" on any business card
4. Confirm the transaction in your wallet
5. Transaction count automatically increments

## 🏗️ Project Structure

```
localbase-miniapp/
├── app/
│   ├── components/
│   │   ├── business/          # Business-related components
│   │   ├── social/            # Community feed components
│   │   └── ui/                # Reusable UI components
│   ├── services/              # API and storage services
│   ├── types/                 # TypeScript type definitions
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Main application page
│   └── providers.tsx          # MiniKit and wallet providers
├── contracts/                 # Foundry smart contracts (optional)
├── public/                    # Static assets
└── README.md                  # This file
```

## 🔧 Configuration

### Blockchain Network
The app is configured for Base Sepolia testnet. To switch networks:

1. Update `NEXT_PUBLIC_CHAIN_ID` in `.env.local`
2. Update RPC URL accordingly
3. Ensure your wallet is connected to the correct network

### Styling
Tailwind CSS is configured with custom colors and components. Modify `tailwind.config.ts` for customization.

## 🧪 Testing

The project includes a Foundry contracts directory for smart contract development:

```bash
# Navigate to contracts directory
cd contracts

# Install Foundry dependencies
forge install

# Run tests
forge test
```

## 📱 Mobile Support

LocalBase is optimized for mobile devices and works seamlessly with mobile wallets through MiniKit integration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter issues:

1. Check your wallet connection and network
2. Ensure you have Base Sepolia ETH
3. Verify environment variables are set correctly
4. Check browser console for error messages

## 🔗 Links

- [Base Documentation](https://docs.base.org)
- [OnchainKit Documentation](https://onchainkit.xyz/getting-started)
- [MiniKit Documentation](https://docs.farcaster.xyz/developers/minikit)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Happy Building! 🚀**
