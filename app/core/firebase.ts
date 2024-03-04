import { app, auth } from "@chainfuse/react";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app);

export { auth, db };
