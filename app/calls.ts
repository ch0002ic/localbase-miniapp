// const counterContractAddress = '0x008eDa6391926f3Fe570f0b163A9082B713322e6'; // your deployed contract address

// ABI for the Counter contract - keeping for future use
/*
const counterContractAbi = [
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setNumber',
    inputs: [
      {
        type: 'uint256',
        name: 'newNumber',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
*/

// Keeping for future use
/*
export const calls = [
  {
    to: counterContractAddress,
    data: '0xd09de08a', // increment() function selector
    value: BigInt(0),
  },
];
*/

export const calls = []; // Empty for now