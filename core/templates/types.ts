export type TemplateKey =
  | "marketplace"
  | "token-drop"
  | "ai"
  | "profile"
  | "stream";

export type TemplateField = {
  name: string;
  dependsOn?: string;
  label: string;
  placeholder?: string;
  initialValue?: string | boolean;
  chainId?: number;
  required: boolean;
  multiline?: boolean;
  type: "text" | "number" | "image" | "select" | "hidden" | "checkbox";
  locked?: true;
};

export interface Template {
  id: TemplateKey;
  name: string;
  description: string;
  skipWalletGate?: boolean;
  placeholder?: string;
  fields: TemplateField[];
  hidden: boolean;
}
