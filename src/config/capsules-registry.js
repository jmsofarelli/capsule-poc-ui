export const registryAddrs = {
  private: "0xA43f76CCf36E691907730247A5cCc870962bD8bB",
  rinkeby: "0xf2e86535D407EcA0E2AE42e8EE6edA47dEC6C93F",
  kovan: "0x64DE21DDc0aD9984574Dfaf596f26257Bd07354d"
};

export const registryAbi = [
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
    name: "capsuleIDsByHash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
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
        internalType: "uint256",
        name: "",
        type: "uint256"
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
    inputs: [],
    name: "numCapsules",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
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
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "_contentHash",
        type: "bytes32"
      }
    ],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
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
        name: "_contentHash",
        type: "bytes32"
      }
    ],
    name: "getCapsule",
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
  }
];
