// Auto-generated ABI for LocalBasePayment contract
export const LocalBasePaymentABI = [
  {
    "type": "function",
    "name": "businessExists",
    "inputs": [{"name": "", "type": "string", "internalType": "string"}],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "businesses",
    "inputs": [{"name": "", "type": "string", "internalType": "string"}],
    "outputs": [
      {"name": "owner", "type": "address", "internalType": "address"},
      {"name": "name", "type": "string", "internalType": "string"},
      {"name": "isActive", "type": "bool", "internalType": "bool"},
      {"name": "totalReceived", "type": "uint256", "internalType": "uint256"},
      {"name": "transactionCount", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBusinessInfo",
    "inputs": [{"name": "businessId", "type": "string", "internalType": "string"}],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct LocalBasePayment.Business",
        "components": [
          {"name": "owner", "type": "address", "internalType": "address"},
          {"name": "name", "type": "string", "internalType": "string"},
          {"name": "isActive", "type": "bool", "internalType": "bool"},
          {"name": "totalReceived", "type": "uint256", "internalType": "uint256"},
          {"name": "transactionCount", "type": "uint256", "internalType": "uint256"}
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserTotalSpent",
    "inputs": [{"name": "user", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "payBusiness",
    "inputs": [{"name": "businessId", "type": "string", "internalType": "string"}],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "registerBusiness",
    "inputs": [
      {"name": "businessId", "type": "string", "internalType": "string"},
      {"name": "name", "type": "string", "internalType": "string"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "toggleBusinessStatus",
    "inputs": [{"name": "businessId", "type": "string", "internalType": "string"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userSpent",
    "inputs": [{"name": "", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "withdrawPayments",
    "inputs": [{"name": "businessId", "type": "string", "internalType": "string"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "BusinessRegistered",
    "inputs": [
      {"name": "businessId", "type": "string", "indexed": true, "internalType": "string"},
      {"name": "owner", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "name", "type": "string", "indexed": false, "internalType": "string"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PaymentMade",
    "inputs": [
      {"name": "businessId", "type": "string", "indexed": true, "internalType": "string"},
      {"name": "customer", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PaymentWithdrawn",
    "inputs": [
      {"name": "businessId", "type": "string", "indexed": true, "internalType": "string"},
      {"name": "owner", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "string"}
    ],
    "anonymous": false
  }
] as const;
