import { type Template } from "./types.js";

/**
 * Stream template configuration.
 */
export const stream: Template = {
  id: "stream",
  hidden: true,
  name: "Streaming",
  description:
    "Deploy your own decentralized streaming website and enable yourself to a brand new revenue stream.",
  fields: [
    {
      name: "name",
      label: "Unique channel Name",
      type: "text",
      required: true,
    },
    {
      name: "avatar",
      label: "Avatar (300x300)",
      type: "image",
      required: true,
    },
  ],
};
