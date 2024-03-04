import { type Template } from "./types.js";

/**
 * AI template configuration.
 */
export const ai: Template = {
  id: "ai",
  hidden: false,
  name: "AI assistant",
  skipWalletGate: false,
  description:
    "Deploy your very own customizable AI personal assistant! Simply give it a purpose, and it will do the rest.",
  fields: [
    {
      name: "name",
      label: "Unique AI Name",
      type: "text",
      required: true,
    },
    {
      name: "avatar",
      label: "Avatar (300x300)",
      type: "image",
      required: true,
    },
    {
      name: "prompt",
      label: "AI Prompt",
      type: "text",
      multiline: true,
      required: true,
    },
  ],
};
