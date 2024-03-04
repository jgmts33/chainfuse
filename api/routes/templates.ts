import type { Template } from "core/templates";
import * as templates from "core/templates";
import router from "../core/router.js";

/**
 * Fetches the list of template configurations.
 */
router.get("/api/templates", (req, res) => {
  res.send(
    Object.keys(templates)
      .map((key) => key as keyof typeof templates)
      .map((key) => templates[key] as Template)
      // Ensure that each item is actually a template object
      .filter((value) => "id" in value)
      .map((value) => ({
        id: value.id,
        name: value.name,
        description: value.description,
      }))
  );
});
