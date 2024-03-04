import { type Request, type Response } from "express";
import errors from "http-errors";
import {
  match as createMatchFn,
  type Match,
  type MatchFunction,
  type Path,
} from "path-to-regexp";
import { ZodError } from "zod";
import { auth } from "./firebase.js";

export type HttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS";

export type Route = {
  method?: HttpMethod[] | HttpMethod;
  path: Path;
  handle: RouteHandler;
};

export type RouteHandler = (
  req: Request,
  res: Response
) => Promise<void> | void;

const execCache = new Map<string, MatchFunction>();

/**
 * Given a URL path pattern or RegEx, returns matched parameters.
 * @example
 *   matchPath({ path: "/api/sites/:id" }, "/api/sites/123")
 *   // => { params: { id: 123 } }
 */
export function matchPath(route: Route, path: string): Match {
  const cacheKey = Array.isArray(route.path)
    ? route.path.map(String).join("::")
    : String(route.path);
  let exec = execCache.get(cacheKey);
  if (!exec) {
    exec = createMatchFn(route.path);
    execCache.set(cacheKey, exec);
  }
  return exec(path);
}

export class Router {
  readonly #routes: Route[] = [];

  user(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: undefined, path, handle });
  }

  get(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: "GET", path, handle });
  }

  head(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: "HEAD", path, handle });
  }

  post(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: "POST", path, handle });
  }

  put(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: "PUT", path, handle });
  }

  patch(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: "PATCH", path, handle });
  }

  delete(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: "DELETE", path, handle });
  }

  options(path: Path, handle: RouteHandler): Promise<void> | void {
    this.#routes.push({ method: "OPTIONS", path, handle });
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      // Verify user credentials (Firebase user ID token)
      const idToken = req.get("authorization")?.substring(7);
      if (idToken) req.user = await auth.verifyIdToken(idToken);

      for (const route of this.#routes) {
        // Check if the HTTP method matches the given route
        if (
          req.method &&
          ((Array.isArray(route.method) &&
            !route.method.includes(req.method as HttpMethod)) ||
            route.method !== req.method)
        ) {
          continue;
        }

        // Check if the URL pathname matches the given route
        const match = matchPath(route, req.path);
        if (!match) continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.params = match.params as any;
        await route.handle(req, res);
        if (res.writableFinished) break;
      }

      if (!res.writableFinished) {
        throw new errors.NotFound();
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "test") {
        console.error(err);
      }

      if (err instanceof ZodError) {
        res.status(400);
        res.send({
          message: new errors.BadRequest().message,
          errors: err.formErrors.fieldErrors,
        });
      } else if (errors.isHttpError(err)) {
        res.status(err.statusCode);
        res.send(err);
      } else if (err instanceof Error) {
        res.status((err as errors.HttpError).status ?? 500);
        res.send({
          message: err.message,
          stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
        });
      } else {
        res.status(500);
        res.send({ message: "Unknown error" });
      }
    }
  }
}

export default new Router();
