#!/bin/bash

# LocalBase Deployment Script
echo "🚀 LocalBase Contract Deployment"
echo "================================"

# Load environment variables
source .env

# Check if we have the required environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not found in .env"
    exit 1
fi

if [ -z "$BASE_SEPOLIA_RPC_URL" ]; then
    echo "❌ Error: BASE_SEPOLIA_RPC_URL not found in .env"
    exit 1
fi

# Get deployer address
DEPLOYER_ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
echo "📍 Deployer Address: $DEPLOYER_ADDRESS"

# Check balance
BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL --ether)
echo "💰 Current Balance: $BALANCE ETH"

# Check if we have enough ETH (minimum 0.001 ETH)
if (( $(echo "$BALANCE < 0.001" | bc -l) )); then
    echo "❌ Insufficient funds for deployment"
    echo "💡 Please get Base Sepolia ETH from:"
    echo "   - https://bridge.base.org/deposit"
    echo "   - https://www.alchemy.com/faucets/base-sepolia"
    echo "   - https://faucet.quicknode.com/base/sepolia"
    echo ""
    echo "📋 Your address: $DEPLOYER_ADDRESS"
    exit 1
fi

echo "✅ Sufficient funds available"
echo ""

# Estimate gas cost
echo "⛽ Estimating deployment cost..."
forge script script/LocalBasePayment.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL

echo ""
echo "🚀 Ready to deploy! Run the following command:"
echo "forge script script/LocalBasePayment.s.sol --rpc-url \$BASE_SEPOLIA_RPC_URL --private-key \$PRIVATE_KEY --broadcast --verify"
