import worker from "./index.js";

test("GET /", async () => {
  const env = getMiniflareBindings();
  const req = new Request(`https://none.${env.APP_HOSTNAME}/`);
  const res = await worker.fetch(req, env, {} as ExecutionContext);

  expect(res.status).toBe(302);
  expect(res.headers.get("location")).toEqual(`https://${env.APP_HOSTNAME}/`);
});
