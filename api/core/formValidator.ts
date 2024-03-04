import { z, ZodError, ZodIssueCode, ZodTypeAny } from "zod";
import {
  FormTemplateField,
  FormTemplateKey,
  OnboardingFormFields,
} from "../forms/index.js";
import * as reserved from "./reserved.js";

const reservedKeys = [
  "id",
  "project",
  "template",
  "version",
  "hostname",
  "hostnameId",
];

export function createFormValidator<T extends "create" | "update">(
  templateId: FormTemplateKey,
  mode: T
) {
  const template =
    templateId === "onboarding"
      ? OnboardingFormFields
      : (() => {
          throw new ZodError([
            {
              code: ZodIssueCode.custom,
              message: "Invalid template ID.",
              path: ["template"],
            },
          ]);
        })();

  let validator = z.object({});

  function setKey<T extends ZodTypeAny>(
    key: string,
    z: T,
    isRequired?: boolean
  ) {
    validator = validator.setKey(
      key,
      mode === "create" && (reservedKeys.includes(key) || isRequired)
        ? z
        : z.optional()
    );
  }

  if (mode === "create") {
    setKey(
      "id",
      z
        .string({
          required_error: "The website ID field is required.",
          invalid_type_error: "Must be a string.",
        })
        .min(5, "Must be at least 5 characters long.")
        .max(36, "Must be at most 36 characters long.")
        .regex(
          /^[0-9A-Za-z-]+$/,
          "Can only contain letters, numbers and dash characters."
        )
        .refine((value) => !reserved.ids.includes(value), "Not available.")
    );
  }

  setKey(
    "project",
    z
      .string({
        required_error: "The project ID field is required.",
        invalid_type_error: "Must be a string.",
      })
      .min(2, "Must be at least 2 characters long.")
      .max(36, "Must be at most 36 characters long.")
      .regex(
        /^[0-9A-Za-z-]+$/,
        "Can only contain letters, numbers and dash characters."
      )
  );

  setKey(
    "template",
    z
      .string({
        required_error: "The template field is required.",
        invalid_type_error: "Must be a string.",
      })
      .min(2, "Must be at least 3 characters long.")
      .max(36, "Must be at most 36 characters long.")
      .regex(
        /^[0-9A-Za-z-]+$/,
        "Can only contain letters, numbers and dash characters."
      )
  );

  setKey(
    "version",
    z
      .string({
        required_error: "The version field is required.",
        invalid_type_error: "Must be a string.",
      })
      .min(3, "Must be at least 3 characters long.")
      .max(12, "Must be at most 12 characters long.")
      .regex(
        /^[0-9A-Za-z-]+$/,
        "Can only contain letters, numbers and dash characters."
      )
  );

  setKey(
    "hostname",
    z
      .string({
        required_error: "The hostname is required.",
        invalid_type_error: "Must be a string.",
      })
      .min(5, "Must be at least 5 characters long.")
      .max(100, "Must be at most 100 characters long.")
      .optional()
  );

  setKey("hostnameId", z.string().uuid().optional());

  const fields = template.steps
    .map((step) => step.fields.map((field) => field))
    .flat();

  fields.forEach((field: FormTemplateField) => {
    if (
      reservedKeys.includes(field.name) ||
      (mode === "update" && field.locked === true)
    ) {
      return;
    }

    switch (field.type) {
      case "text":
      case "hidden":
        setKey(field.name, z.string(), field.required);
        break;
      case "select":
        setKey(field.name, z.array(z.number()), field.required);
        break;
      case "number":
        setKey(field.name, z.number(), field.required);
        break;
      case "checkbox":
        setKey(field.name, z.boolean(), field.required);
        break;
      case "image":
        setKey(field.name, z.string().url(), field.required);
        break;
      default:
        throw new TypeError(`Unknown field type: ${field.type}`);
    }
  });

  return validator;
}
