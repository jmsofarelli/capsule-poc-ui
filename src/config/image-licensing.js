export const licensingAddrs = {
  private: "0x5D48b9Ab4A6F2BB957f1Bc2a7Dce6bDF4431Cf95"
};

export const licensingAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registryAddr",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
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
      },
      {
        indexed: false,
        internalType: "address",
        name: "_licensee",
        type: "address"
      }
    ],
    name: "LicenseApproved",
    type: "event"
  },
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
        name: "_licensee",
        type: "address"
      }
    ],
    name: "LicenseCancelled",
    type: "event"
  },
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
      },
      {
        indexed: false,
        internalType: "address",
        name: "_licensee",
        type: "address"
      }
    ],
    name: "LicenseRefused",
    type: "event"
  },
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
      },
      {
        indexed: false,
        internalType: "address",
        name: "_licensee",
        type: "address"
      }
    ],
    name: "LicenseRequested",
    type: "event"
  },
  {
    constant: true,
    inputs: [],
    name: "licensePrice",
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
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "licenseeRequests",
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
    name: "licenses",
    outputs: [
      {
        internalType: "bytes32",
        name: "contentHash",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "licensee",
        type: "address"
      },
      {
        internalType: "enum ImageLicensing.LicenseStatus",
        name: "status",
        type: "uint8"
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
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "ownerRequests",
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
    inputs: [],
    name: "getLicensableImages",
    outputs: [
      {
        components: [
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
        internalType: "struct ImageLicensing.Capsule[100]",
        name: "images",
        type: "tuple[100]"
      },
      {
        internalType: "uint256",
        name: "count",
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
      }
    ],
    name: "requestLicense",
    outputs: [],
    payable: true,
    stateMutability: "payable",
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
        internalType: "address",
        name: "_licensee",
        type: "address"
      }
    ],
    name: "approveLicenseRequest",
    outputs: [],
    payable: true,
    stateMutability: "payable",
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
        internalType: "address",
        name: "_licensee",
        type: "address"
      }
    ],
    name: "refuseLicenseRequest",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "_contentHash",
        type: "bytes32"
      }
    ],
    name: "cancelLicenseRequest",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getIncomingRequests",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "contentHash",
            type: "bytes32"
          },
          {
            internalType: "address",
            name: "licensee",
            type: "address"
          },
          {
            internalType: "enum ImageLicensing.LicenseStatus",
            name: "status",
            type: "uint8"
          }
        ],
        internalType: "struct ImageLicensing.License[10]",
        name: "incomingRequests",
        type: "tuple[10]"
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getOutGoingRequests",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "contentHash",
            type: "bytes32"
          },
          {
            internalType: "address",
            name: "licensee",
            type: "address"
          },
          {
            internalType: "enum ImageLicensing.LicenseStatus",
            name: "status",
            type: "uint8"
          }
        ],
        internalType: "struct ImageLicensing.License[10]",
        name: "outgoingRequests",
        type: "tuple[10]"
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
