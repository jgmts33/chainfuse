import { type Template } from "./types.js";

/**
 * NFT Marketplace template configuration.
 */
export const marketplace: Template = {
  hidden: false,
  id: "marketplace",
  name: "NFT Marketplace",
  description:
    "Launch your own Decentralized NFT marketplace, filled with the tools you need to grow a community.",
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    {
      name: "tagline",
      label: "Tagline",
      type: "text",
      required: true,
    },
    {
      name: "logoUrl",
      label: "Logo (100x100)",
      type: "image",
      required: true,
    },
    {
      name: "logoRectangleUrl",
      label: "Logo (200x50)",
      type: "image",
      required: true,
    },
    {
      name: "tenantId",
      label: "Tenant ID",
      type: "hidden",
      required: false,
    },
  ],
};
