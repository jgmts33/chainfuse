import { FormTemplate } from "./types.js";

/**
 * NFT Token Drop template configuration.
 */
const OnboardingFormFields: FormTemplate = {
  id: "onboarding",
  hidden: false,
  skipWalletGate: false,
  name: "Decentralized Profile",
  description:
    "Launch your very own decentralized business card and profile to enable yourself to the beginning of a frictionless economy.",
  steps: [
    {
      title: "Basic information",
      fields: [
        {
          name: "profileName",
          label: "Name",
          type: "text",
          placeholder: "John Wick",
          required: true,
        },
        {
          name: "title",
          label: "Title",
          type: "text",
          placeholder: "CEO",
          required: true,
        },
        {
          name: "telegram",
          label: "Telegram Handle (with the @)",
          placeholder: "@chainfuse",
          type: "text",
          required: false,
        },
        {
          name: "avatar",
          label: "Avatar (300x300)",
          type: "image",
          publicUpload: true,
          required: false,
        },
      ],
    },
    {
      title: "Work information",
      fields: [
        {
          name: "work",
          label: "What's the name of your company?",
          type: "text",
          placeholder: "Work name",
          required: true,
        },
        {
          name: "project",
          label: "What project are you working on right now?",
          type: "text",
          placeholder: "Project name",
          required: true,
        },
        {
          name: "chainId",
          label: "Which chains do you work with?",
          placeholder: "Select a chain",
          type: "select",
          required: true,
        },
        {
          name: "template",
          label: "Template",
          placeholder: "Template",
          type: "hidden",
          initialValue: "onboarding",
          required: false,
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
export { OnboardingFormFields };
