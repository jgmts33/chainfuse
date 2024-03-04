import { type Request, type Response } from "express";
import router from "./core/router.js";
import "./routes/index.js";

/**
 * Handles API requests such as:
 *
 * @example
 *   GET /api/sites
 *   GET /api/sites/example
 *   POST /api/sites/example
 *   DELETE /api/sites/example
 */
export async function api(req: Request, res: Response) {
  await router.handle(req, res);
}
