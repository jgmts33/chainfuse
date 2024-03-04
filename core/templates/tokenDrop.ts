import { type Template } from "./types.js";

/**
 * NFT Token Drop template configuration.
 */
export const tokenDrop: Template = {
  id: "token-drop",
  hidden: false,
  name: "NFT Tickets",
  skipWalletGate: false,
  description:
    "Launch your own NFT tickets and let people buy them to enter your virtual or physical event.",
  fields: [
    {
      name: "name",
      label: "Site Name",
      type: "text",
      required: true,
    },
    {
      name: "chainId",
      label: "Chain",
      placeholder: "Select a chain",
      type: "select",
      required: true,
    },
    {
      name: "tokenName",
      label: "Token Drop Name",
      type: "text",
      required: true,
    },
    {
      name: "tokenDescription",
      label: "Token Drop Description",
      type: "text",
      required: true,
    },
    {
      name: "logoUrl",
      label: "Logo URL",
      type: "image",
      required: true,
      locked: true,
    },
    {
      name: "supply",
      label: "Supply",
      type: "number",
      required: true,
      locked: true,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      locked: true,
    },
  ],
};
