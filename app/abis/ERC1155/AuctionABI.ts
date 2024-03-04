export const AUCTION_ADRESS = "0x740Aa7aF5bCF2C03543447EaAEda4905437821E9";

export const AUCTION_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "cancelAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "cashOutAllPreviousBidders",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "registrationId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "createAuctionItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "highestBidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "highestBid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "highestBindingBid",
        type: "uint256",
      },
    ],
    name: "LogBid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "LogCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "withdrawer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "withdrawalAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogWithdrawal",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "placeBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "auctionHasEnded",
    outputs: [
      {
        internalType: "bool",
        name: "ended",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bidIncrement",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "registrationId",
        type: "uint256",
      },
    ],
    name: "fetchAuctionItems",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "nftContract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "registrationId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "chainTokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address payable",
                name: "seller",
                type: "address",
              },
            ],
            internalType: "struct AuctionItem",
            name: "auctionItem",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "startBlock",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "endTime",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "onAuction",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "canceled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "auctionIsSettled",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "ownerHasWithdrawn",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "totalBids",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "highestBidder",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "highestBindingBid",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "auctionOver",
                type: "bool",
              },
            ],
            internalType: "struct AuctionData",
            name: "auctionData",
            type: "tuple",
          },
        ],
        internalType: "struct AuctionResponse[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "getAuction",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startBlock",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "onAuction",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "canceled",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "auctionIsSettled",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "ownerHasWithdrawn",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "totalBids",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "highestBidder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "highestBindingBid",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "auctionOver",
            type: "bool",
          },
        ],
        internalType: "struct AuctionData",
        name: "item",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBlockNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "getFundsByBidder",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "bidder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bid",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "withdrew",
            type: "bool",
          },
        ],
        internalType: "struct Bidder",
        name: "bidder",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "getHighestBid",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "getHighestBidder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "isAuctionWinner",
    outputs: [
      {
        internalType: "bool",
        name: "isWinner",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "isOnAuction",
    outputs: [
      {
        internalType: "bool",
        name: "onAuction",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "pendingWithdrawalAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "returnBidders",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "bidder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bid",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "withdrew",
            type: "bool",
          },
        ],
        internalType: "struct Bidder[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftContract",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "chainTokenId",
        type: "uint256",
      },
    ],
    name: "totalBidders",
    outputs: [
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
