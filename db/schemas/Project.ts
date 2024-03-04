import { DocumentData } from "firebase/firestore";
import { z } from "zod";
import * as reserved from "./reserved";

/**
 * @see https://zod.dev/
 */
export const Project = z.object({
  id: z
    .string({
      required_error: "The project ID field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(5, "Must be at least 5 characters long.")
    .max(36, "Must be at most 36 characters long.")
    .regex(
      /^[a-z][a-z0-9-]*[a-z0-9]$/,
      "Can only contain letters, numbers and dash characters."
    )
    .refine((value) => !reserved.ids.includes(value), "Not available."),
  name: z
    .string({
      required_error: "The name field is required.",
      invalid_type_error: "Must be a string.",
    })
    .min(2, "Must be at least 2 characters long.")
    .max(100, "Must be at most 100 characters long."),
});

export interface Project extends z.infer<typeof Project>, DocumentData {}
