import { customHostnames } from "../core/cloudflare.js";
import { Forbidden, Unauthorized } from "../core/errors.js";
import router from "../core/router.js";

router.get("/api/hostnames", async (req, res) => {
  // Check permissions
  if (!req.user) throw new Unauthorized();
  if (!req.user.email?.endsWith("@chainfuse.io")) throw new Forbidden();

  // Fetch the list of custom hostnames from Cloudflare
  // https://dash.cloudflare.com/e9b82b39aa91575a2643529d24a1bf02/chainfuse.com/ssl-tls/custom-hostnames
  const query = customHostnames.find({
    hostname: req.query.hostname as string | undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    perPage: req.query.page ? Number(req.query.perPage) : undefined,
    order: req.query.order as "ssl" | "ssl_status" | undefined,
    direction: req.query.direction as "asc" | "desc" | undefined,
  });

  const records = await query.all();
  res.send(records);
});
