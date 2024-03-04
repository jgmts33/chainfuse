import { FormTemplate } from "./types.js";

/**
 * NFT Token Drop template configuration.
 */
const CreateCollectionFields: FormTemplate = {
  id: "createCollection",
  hidden: false,
  skipWalletGate: false,
  name: "Create NFT Collection",
  description:
    "Launch your very own decentralized business card and profile to enable yourself to the beginning of a frictionless economy.",
  steps: [
    {
      title: "Connect your wallet",
      subTitle: "Connect your wallet",
      description:
        "You need to connect your wallet, any tickets will be sent to the wallet address you connect.",
      disableNext: true,
      fields: [
        {
          name: "connectWallet",
          label: "Connect wallet",
          type: "wallet",
          required: true,
        },
      ],
    },
    {
      title: "Create tickets",
      subTitle: "Create tickets",
      description:
        "You need to connect your wallet, any tickets will be sent to the wallet address you connect.",
      fields: [
        {
          type: "select",
          category: "chain",
          name: "chainId",
          multiple: false,
          enableAll: false,
          enableChangeChain: true,
          label: "Select a chain",
          placeholder: "Select a chain",
          required: true,
        },
        {
          type: "nft",
          category: "multiple",
          name: "nfts",
          label: "Upload NFTs",
          placeholder: "Upload NFTs",
          required: true,
        },
      ],
    },
    {
      title: "Create account",
      subTitle: "Create account",
      description: "Create account",
      fields: [
        {
          type: "api",
          method: "createCollection",
          gated: true,
          name: "Create collection",
          label: "Create collection",
          placeholder: "Create account",
          required: true,
        },
      ],
    },
  ],
};

// Additional potential steps
// {
//   title: "Advanced information",
//   fields: [
//     {
//       name: "discoverable",
//       label: "Make discoverable?",
//       type: "checkbox",
//       initialValue: true,
//       required: false,
//     },
//     {
//       name: "kyc",
//       label: "Request KYC?",
//       type: "checkbox",
//       initialValue: true,
//       required: false,
//     },
//     {
//       name: "acceptPayments",
//       label: "Enable crypto payments?",
//       type: "checkbox",
//       initialValue: true,
//       required: false,
//     },
//     {
//       name: "enableAi",
//       label: "Enable AI assistant?",
//       type: "checkbox",
//       initialValue: true,
//       required: false,
//     },
//   ],
// },
// `template/${event}/project=${company}`
// {
//   title: "Who else is working in this project?",
//   fields: [
//     {
//       name: "member1",
//       label: "Invite team mate #1",
//       type: "text",
//       placeholder: "user@chainfuse.com",
//       required: false,
//     },
//     {
//       name: "member2",
//       label: "Invite team mate #2",
//       type: "text",
//       placeholder: "user@chainfuse.com",
//       required: false,
//     },

//     {
//       name: "member3",
//       label: "Invite team mate #3",
//       type: "text",
//       placeholder: "user@chainfuse.com",
//       required: false,
//     },
//   ],
// },
// {
//   title: "Optional settings",
//   fields: [
//     {
//       name: "linkedIn",
//       label: "LinkedIn URL",
//       placeholder: "https://www.linkedin.com/company/chainfuse/",
//       type: "text",
//       required: false,
//     },
//     {
//       name: "github",
//       label: "Github url",
//       placeholder: "https://github.com/ChainFuse",
//       type: "text",
//       required: false,
//     },
//     {
//       name: "twitter",
//       label: "Twitter Handle",
//       placeholder: "@chainfuse",
//       type: "text",
//       required: false,
//     },
//     {
//       name: "calendar",
//       label: "Schedule meeting",
//       placeholder: `https://calendly.com/chainfuse/30min?month=${new Date().getFullYear()}-${new Date().getMonth()}`,
//       type: "text",
//       required: false,
//     },
// ],
// },

export { CreateCollectionFields };
