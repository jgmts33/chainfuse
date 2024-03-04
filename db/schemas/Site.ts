import { DocumentData } from "firebase/firestore";
import { z } from "zod";
import * as reserved from "./reserved";

/**
 * @see https://zod.dev/
 */
export const Site = z.object({
  id: z
    .string({
      required_error: "The website ID field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(5, "Must be at least 5 characters long.")
    .max(36, "Must be at most 36 characters long.")
    .regex(
      /^[a-z][a-z0-9-]*[a-z0-9]$/,
      "Can only contain letters, numbers and dash characters."
    )
    .refine((value) => !reserved.ids.includes(value), "Not available."),
  project: z
    .string({
      required_error: "The project ID field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(5, "Must be at least 5 characters long.")
    .max(36, "Must be at most 36 characters long.")
    .regex(
      /^[a-z][a-z0-9-]*[a-z0-9]$/,
      "Can only contain letters, numbers and dash characters."
    ),
  template: z
    .string({
      required_error: "The template field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(2, "Must be at least 2 characters long.")
    .max(36, "Must be at most 36 characters long.")
    .regex(
      /^[a-z][a-z0-9-]*[a-z0-9]$/,
      "Can only contain letters, numbers and dash characters."
    ),
  version: z
    .string({
      required_error: "The version field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(3, "Must be at least 3 characters long.")
    .max(12, "Must be at most 12 characters long.")
    .regex(
      /^[a-z][a-z0-9-]*[a-z0-9]$/,
      "Can only contain letters, numbers and dash characters."
    ),
  name: z
    .string({
      required_error: "The name field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(2, "Must be at least 2 characters long.")
    .max(100, "Must be at most 100 characters long."),
  description: z
    .string({
      required_error: "The description field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(5, "Must be at least 5 characters long.")
    .max(500, "Must be at most 500 characters long."),
  hostname: z
    .string({
      required_error: "The description field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(5, "Must be at least 5 characters long.")
    .max(100, "Must be at most 100 characters long.")
    .optional(),
  hostnameId: z.string().uuid().optional(),
  logoUrl: z.string().url("Invalid image URL.").optional(),
  env: z.any(),
});

export interface Site extends z.infer<typeof Site>, DocumentData {}
