export type FormTemplateKey = "onboarding" | "testing" | "createCollection";

export type FormTemplateField = {
  required: boolean;
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "image"
    | "select"
    | "hidden"
    | "checkbox"
    | "nft"
    | "createAccount"
    | "wallet"
    | "dialog"
    | "api";
  method?: string;
  gated?: boolean;
  dependsOn?: string;
  category?: "chain" | "multiple" | string;
  enableAll?: boolean;
  multiple?: boolean;
  placeholder?: string;
  publicUpload?: boolean;
  initialValue?: string | number | boolean;
  chainId?: number;
  multiline?: boolean;
  enableChangeChain?: boolean;
  locked?: true;
};

export type Step = {
  title: string;
  subTitle?: string;
  disableNext?: boolean;
  description?: string;
  type?: "signup";
  fields: FormTemplateField[];
};

export type FormTemplate = {
  id: FormTemplateKey;
  name: string;
  description: string;
  skipWalletGate?: boolean;
  placeholder?: string;
  steps: Array<Step>;
  hidden: boolean;
};
