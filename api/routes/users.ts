import errors from "http-errors";
import { auth, db } from "../core/firebase.js";
import router from "../core/router.js";

router.get("/api/users", async (req, res) => {
  if (!req.user) throw new errors.Unauthorized();
  if (!req.user.email?.endsWith("@chainfuse.io")) throw new errors.Forbidden();

  const users = await auth.listUsers();
  res.send(users);
});

router.get("/api/users/followers", async (req, res) => {
  if (!req.user) throw new errors.Unauthorized();
  // if (!req.user.email?.endsWith("@chainfuse.io")) throw new errors.Forbidden();

  const followedId = req.user.uid;

  const followers = await db.collection(`followers`).doc(followedId).get();

  res.send({
    followers: followers.data(),
  });
});

router.post("/api/users/follow", async (req, res): Promise<void> => {
  if (!req.user) throw new errors.Unauthorized();
  // if (!req.user.email?.endsWith("@chainfuse.io")) throw new errors.Forbidden();

  const followedId = req.body.followedId;
  const followerId = req.user.uid;

  console.log("Follow");
  console.log("followedId =====>", followedId);

  // Fetch the `site` record from Firestore
  await db
    .collection(`followers`)
    .doc(followedId)
    .set({ [followerId]: true }, { merge: true });

  await db
    .collection(`following`)
    .doc(followerId)
    .set({ [followedId]: true }, { merge: true });

  res.status(200).send("ok");
});

router.post("/api/users/unfollow", async (req, res): Promise<void> => {
  if (!req.user) throw new errors.Unauthorized();
  // if (!req.user.email?.endsWith("@chainfuse.io")) throw new errors.Forbidden();

  const followedId = req.body.followedId;
  const followerId = req.user.uid;

  console.log("Unfollow");
  console.log("followedId =====>", followedId);

  await db
    .collection(`followers`)
    .doc(followedId)
    .set({ [followerId]: false }, { merge: true });

  await db
    .collection(`following`)
    .doc(followerId)
    .set({ [followedId]: false }, { merge: true });

  res.status(200).send("ok");
});
