import { type Template } from "./types.js";

/**
 * NFT Token Drop template configuration.
 */
export const profile: Template = {
  id: "profile",
  hidden: false,
  skipWalletGate: false,
  name: "Decentralized Profile",
  description:
    "Launch your very own decentralized business card and profile to enable yourself to the beginning of a frictionless economy.",
  fields: [
    {
      name: "name",
      label: "Unique Name",
      type: "text",
      required: true,
    },
    {
      name: "profileName",
      label: "Name",
      type: "text",
      placeholder: "John Doe",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "CEO",
      required: false,
    },

    {
      name: "work",
      label: "Where do you work at?",
      type: "text",
      placeholder: "CEO",
      required: false,
    },
    {
      name: "enableAi",
      label: "Enable AI Executive Assistant",
      type: "checkbox",
      initialValue: true,
      required: true,
    },
    {
      name: "avatar",
      label: "Avatar (300x300)",
      type: "image",
      required: true,
    },
    {
      name: "telegram",
      label: "Telegram Handle",
      placeholder: "@chainfuse",
      type: "text",
      required: true,
    },
    {
      name: "brandingBg",
      label: "Branding Background (600x300)",
      type: "image",
      required: false,
    },
    {
      name: "brandingLogo",
      label: "Branding Logo (150x55)",
      type: "image",
      required: false,
    },
    {
      name: "linkedIn",
      label: "LinkedIn URL",
      placeholder: "https://www.linkedin.com/company/chainfuse/",
      type: "text",
      required: false,
    },
    {
      name: "calendar",
      label: "Schedule meeting",
      placeholder: `https://calendly.com/chainfuse/30min?month=${new Date().getFullYear()}-${new Date().getMonth()}`,
      type: "text",
      required: false,
    },
    {
      name: "github",
      label: "Github url",
      placeholder: "https://github.com/ChainFuse",
      type: "text",
      required: false,
    },
    {
      name: "twitter",
      label: "Twitter Handle",
      placeholder: "@chainfuse",
      type: "text",
      required: false,
    },
    {
      name: "instagram",
      label: "Instagram Handle",
      placeholder: "@chainfuse",
      type: "text",
      required: false,
    },
    {
      name: "email",
      label: "Email address",
      placeholder: "hello@chainfuse.com",
      type: "text",
      required: false,
    },
    {
      name: "customUrl",
      label: "Custom URL",
      placeholder: "https://www.chainfuse.com",
      type: "text",
      required: false,
    },
    {
      name: "customUrlText",
      label: "Custom URL Text",
      placeholder: "Visit our website",
      type: "text",
      required: false,
    },
    {
      name: "acceptPayments",
      label: "Accept payments in crypto",
      type: "checkbox",
      initialValue: true,
      required: false,
    },
    {
      name: "address",
      label: "Custom address",
      type: "hidden",
      required: false,
    },
    {
      name: "tenantId",
      label: "Tenant ID",
      type: "hidden",
      required: false,
    },
  ],
};
