import router from "../core/router.js";

router.post("/api/stream/create", async (req, res) => {
  res.status(200).send({
    status: "created",
  });
});
