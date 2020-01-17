import web3 from './web3';

const address = "0xEe67c16D520051BE39DA5d93f550eF0b13c06683";
const abi = [
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
        name: "ipfsHash",
        type: "bytes32"
      },
      {
        internalType: "uint8",
        name: "hashFunction",
        type: "uint8"
      },
      {
        internalType: "uint8",
        name: "size",
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
        name: "_ipfsHash",
        type: "bytes32"
      },
      {
        internalType: "uint8",
        name: "_hashFunction",
        type: "uint8"
      },
      {
        internalType: "uint8",
        name: "_size",
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
        name: "oldContentHash",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "newContentHash",
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

export default new web3.eth.Contract(abi, address);
