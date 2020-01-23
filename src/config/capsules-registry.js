export const address = {
  rinkeby: '0xf2e86535D407EcA0E2AE42e8EE6edA47dEC6C93F',
  kovan: '0x64DE21DDc0aD9984574Dfaf596f26257Bd07354d'
}

export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_contentHash",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_owner",
        type: "address"
      }
    ],
    name: "CapsuleRegistered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_oldContentHash",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_newContentHash",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_owner",
        type: "address"
      }
    ],
    name: "VersionUpdated",
    type: "event"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "capsules",
    outputs: [
      {
        internalType: "bytes32",
        name: "ipfsDigest",
        type: "bytes32"
      },
      {
        internalType: "uint8",
        name: "hashFunction",
        type: "uint8"
      },
      {
        internalType: "uint8",
        name: "hashSize",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    name: "versions",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "_contentHash",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "_ipfsDigest",
        type: "bytes32"
      },
      {
        internalType: "uint8",
        name: "_hashFunction",
        type: "uint8"
      },
      {
        internalType: "uint8",
        name: "_hashSize",
        type: "uint8"
      }
    ],
    name: "registerCapsule",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "_oldContentHash",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "_newContentHash",
        type: "bytes32"
      }
    ],
    name: "updateVersion",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];
